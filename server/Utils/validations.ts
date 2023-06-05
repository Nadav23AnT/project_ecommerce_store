import validator from 'validator';

const phoneRegExp =
  /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[5]{1}[01234578]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/gm;
const passwordRegExp =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const checkIsURL = (url: string) =>
  validator.isURL(url, {
    protocols: ['http', 'https'], // valid protocols can be modified with this option. default: ['http','https','ftp'].
    require_tld: true,
    require_protocol: false, // if set as true isURL will return false if protocol is not present in the URL.
    require_host: true, // if set as false isURL will not check if host is present in the URL.
    require_port: false, // if set as true isURL will check if port is present in the URL.
    require_valid_protocol: true, // isURL will check if the URL's protocol is present in the protocols option.
    allow_underscores: true,
    // host_whitelist: false,
    // host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false, // if set as true protocol relative URLs will be allowed.
    allow_fragments: true, // if set as false isURL will return false if fragments are present.
    allow_query_components: true, // if set as false isURL will return false if query components are present.
    disallow_auth: false,
    // validate_length: true // if set as false isURL will skip string length validation (2083 characters is IE max URL length).
  });

export const checkIsStrongPassword = (password: string) =>
  passwordRegExp.test(password);

export const checkIsCorrectPhone = (phoneNumber: string) =>
  phoneRegExp.test(phoneNumber);
