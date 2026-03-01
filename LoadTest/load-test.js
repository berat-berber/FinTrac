import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:5134';
const USERS = Array.from({ length: 10 }, (_, i) => ({
  email: `Testuser${i + 1}@example.com`,
  password: `Testuser${i + 1}@example.com`,
}));
const FILES = ['./isbank-dummy.xls', './ziraat-dummy.xlsx'];
const MIME_TYPES = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
const ACCOUNTS = ['Is Bank', 'Ziraat Bank'];
const BANKS = ['Is Bank', 'Ziraat Bank'];
const FILE_CONTENTS = FILES.map((f) => open(f, 'b'));

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // warm up
    { duration: '1m',  target: 25 },   // ramp up
    { duration: '1m',  target: 50 },  // push harder
    { duration: '1m',  target: 75 },  // stress
    { duration: '1m',  target: 100 },  // spike
    { duration: '30s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
  },
};

export function setup() {
  const sessions = USERS.map((user) => {
    const loginRes = http.post(
      `${BASE_URL}/api/Auth/login`,
      JSON.stringify({ email: user.email, password: user.password }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    check(loginRes, { [`login ok: ${user.email}`]: (r) => r.status === 200 });
    if (!loginRes.body) throw new Error(`Login failed for ${user.email}`);
    const token = loginRes.body;
    const authHeader = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    ACCOUNTS.forEach((accountName) => {
      const accountRes = http.post(
        `${BASE_URL}/api/Accounts`,
        JSON.stringify({ name: accountName, accountCategory: 'Checking', currency: '₺' }),
        { headers: authHeader }
      );
      check(accountRes, { [`account ok: ${accountName} for ${user.email}`]: (r) => r.status === 200 });
    });

    sleep(0.5);

    return { token };
  });

  return { sessions };
}

export default function (data) {
  const vuIndex = (__VU - 1) % 10;
  const token = data.sessions[vuIndex].token;
  const authHeader = { Authorization: `Bearer ${token}` };

  const iterationIndex = __ITER % 2;
  const filePath = FILES[iterationIndex];
  const mimeType = MIME_TYPES[iterationIndex];
  const accountName = ACCOUNTS[iterationIndex];
  const bankName = BANKS[iterationIndex];
  const file = FILE_CONTENTS[iterationIndex];

  const summaryRes = http.post(
    `${BASE_URL}/api/Summaries`,
    {
      BankName: bankName,
      AccountName: accountName,
      File: http.file(file, filePath, mimeType),
    },
    { headers: authHeader }
  );
  check(summaryRes, { 'summary ok': (r) => r.status === 200 });

  const parses = JSON.parse(summaryRes.body);

  const txRes = http.post(
    `${BASE_URL}/api/Transactions`,
    JSON.stringify({ parses: parses, accountName: accountName }),
    { headers: { 'Content-Type': 'application/json', ...authHeader } }
  );
  check(txRes, { 'transaction ok': (r) => r.status === 200 });

  sleep(1);
}
