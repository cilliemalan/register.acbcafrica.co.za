const winston = require('winston');
const sgMail = require('@sendgrid/mail');
const { sendGridKey, defaultFromEmail } = require('../config');

if (sendGridKey) {
    sgMail.setApiKey(sendGridKey);
    winston.info('sendgrid API configured');
} else {
    winston.info('not using sendgrid because no API key was specified');
}

module.exports = {
    sendTransactionalMail: (to, templateId, subject = '', from = defaultFromEmail, substitutions = {}) => {
        if (sendGridKey) {
            winston.info(`sending transactional mail to ${to} from ${from} subject ${subject || '(default)'} using template ${templateId}`);
            winston.silly(`substiutions: %O`, substitutions);
            var promise = sgMail.send({ to, from, subject, templateId, dynamicTemplateData: substitutions });
            promise.then(() => winston.verbose(`transactional mail successfully sent to ${to} using template ${templateId}`))
                .catch(e => winston.error(`failed to send transactional mail to ${to} using template ${templateId}: ${e}`));
            return promise;
        } else {
            return Promise.resolve();
        }
    }
};
