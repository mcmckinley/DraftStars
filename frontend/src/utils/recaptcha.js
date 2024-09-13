export const executeRecaptcha = (action) => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject("reCAPTCHA not loaded");
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute("YOUR_SITE_KEY", { action })
        .then(resolve)
        .catch(reject);
    });
  });
};
