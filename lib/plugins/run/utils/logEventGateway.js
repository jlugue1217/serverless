const chalk = require('chalk');
const log = require('./log');

const colorText = chalk.hex('#D86121');
const caret = colorText('|');

const prettifyValue = value => {
  const prettified = JSON.stringify(value, null, 2).replace(
    new RegExp('\\n', 'g'),
    `\n                ${caret}      `
  );
  return `                ${caret}      ${prettified}`;
};

const transformMessages = parsedMsg => {
  if (parsedMsg.msg === 'Function registered.') {
    return `Registered function ${parsedMsg.functionId}\n`;
  } else if (parsedMsg.msg === 'Subscription created.') {
    return `Subscribed function ${parsedMsg.functionId} to event ${parsedMsg.event}\n`;
  } else if (parsedMsg.msg === 'Event received.') {
    const event = JSON.parse(parsedMsg.event);
    if (event.headers) {
      const text = `Received http event on path ${parsedMsg.path} ${parsedMsg.method}\n`;
      // TODO const ppBody = prettifyValue(event.body);
      const ppBody = prettifyValue(event.data);
      const bodyText = `                ${caret}    body:\n${ppBody}`;
      return `${text}${bodyText}\n`;
    }
    const text = `Received event ${event.event}\n`;
    const dataTypeText = `                ${caret}    dataType: ${event.dataType}\n`;
    const ppData = prettifyValue(event.data);
    const dataText = `                ${caret}    data:\n${ppData}`;
    return `${text}${dataTypeText}${dataText}\n`;
  } else if (parsedMsg.msg === 'Function invoked.') {
    const text = `Invoked function ${parsedMsg.functionId}\n`;
    return `${text}`;
  } else if (parsedMsg.msg === 'Function invocation failed.') {
    const text = `Failed to invoke function ${parsedMsg.functionId}\n`;
    const errorText = `                ${caret}    error: ${parsedMsg.error}\n`;
    return `${text}${errorText}`;
  } else if (parsedMsg.msg === 'Handling "http" event failed.') {
    const text = `Failed to handle http event on path ${parsedMsg.path}\n`;
    const errorText = `                ${caret}    error: ${parsedMsg.error}\n`;
    return `${text}${errorText}`;
  }
  return `${parsedMsg.msg.trim()}\n`;
};

module.exports = msg => {
  // console.log('MSG: ', msg);
  const prefix = colorText(' Event Gateway  |  ');
  try {
    const parsedMsg = JSON.parse(msg);
    log(`${prefix}${transformMessages(parsedMsg)}`);
  } catch (err) {
    console.log('ERROR:', `----${msg}----`);
    // log(`${prefix}raw Event Gateway output: ${msg}\n`);
  }
};