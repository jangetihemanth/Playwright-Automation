import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    login_api: { executor: 'constant-vus', vus: Number(__ENV.VUS || 100), duration: __ENV.DURATION || '30s' },
  },
};

export default function () {
  const tenantCode = __ENV.LOGIN_TENANT;
  const phone = __ENV.LOGIN_PHONE;
  if (!tenantCode || !phone) throw new Error('Set LOGIN_TENANT and LOGIN_PHONE for the DEV load test');
  const response = http.post('https://dev-identity-service.aixhub.ai/auth/otp/send', JSON.stringify({ tenantCode, phone: `+91${phone}`, action: 'login' }), { headers: { 'Content-Type': 'application/json' } });
  check(response, { 'status is handled': item => [200, 400, 401, 403].includes(item.status) });
}
