const { TYPE, parse } = require('@formatjs/icu-messageformat-parser');

const nestingRegex = /^\$t\(\w+:\w+(?:\.\w+)*\)$/;

function validateNesting(message) {
  let searchIndex = 0;
  let nestingIndex = message.indexOf('$t(');

  while (nestingIndex !== -1) {
    const closingIndex = message.indexOf(')', nestingIndex);
    if (closingIndex === -1) {
      throw new SyntaxError('Nesting error. See: https://www.i18next.com/misc/json-format');
    }

    const nestingCall = message.slice(nestingIndex, closingIndex + 1);
    if (!nestingRegex.test(nestingCall)) {
      throw new SyntaxError('Nesting error. See: https://www.i18next.com/misc/json-format');
    }

    searchIndex = closingIndex + 1;
    nestingIndex = message.indexOf('$t(', searchIndex);
  }
}

function assertCountUsesPlural(elements) {
  for (const element of elements) {
    if (element.type === TYPE.argument && element.value === 'count') {
      throw new SyntaxError('Count arguments must use ICU plural rules.');
    }

    if (element.type === TYPE.select && element.value === 'count') {
      throw new SyntaxError('Count arguments must use ICU plural rules.');
    }

    if (element.type === TYPE.plural || element.type === TYPE.select) {
      for (const option of Object.values(element.options)) {
        assertCountUsesPlural(option.value);
      }
    }
  }
}

function validate(message = '') {
  if (typeof message !== 'string') {
    throw new TypeError('Message must be a String.');
  }
  if (!message.trim()) {
    throw new SyntaxError('Message is Empty.');
  }
  validateNesting(message);
  try {
    const elements = parse(message);
    assertCountUsesPlural(elements);
  }
  catch (error) {
    throw new SyntaxError(`ICU message error: ${error.message}`);
  }
}

module.exports = validate;
