// WAMessage__c message = WhatsAppUtils.sendMediaMessage(
//   '212605809656',
//   'https://ensa-7b-dev-ed.develop.file.force.com/sfc/dist/version/download/?oid=00D8e000000SoQO&ids=0688e00000BzBSn&d=%2Fa%2F8e000000LYig%2FaeWU9W0cFpsZ1V5dBjENC1GcZlnuHKJfBPHlUQd1i20&asPdf=false',
//   'test file.pdf'
// );

WAMessage__c message = WhatsAppLWCService.sendMediaMessage(
  '212605809656',
  'https://ensa-7b-dev-ed.develop.file.force.com/sfc/dist/version/download/?oid=00D8e000000SoQO&ids=0688e00000BzBSn&d=%2Fa%2F8e000000LYig%2FaeWU9W0cFpsZ1V5dBjENC1GcZlnuHKJfBPHlUQd1i20&asPdf=false',
  'test file.pdf'
);
System.debug('im getting message' + message);
