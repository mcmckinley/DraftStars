export const executeRecaptcha = (action) => {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      reject("reCAPTCHA not loaded");
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute("6LcjTTUqAAAAAFL_KYNHxhh1Jc2NFThVQsY_yZ3y", { action })
        .then(resolve)
        .catch(reject);
    });
  });
};
