document.addEventListener('DOMContentLoaded', () => {
  const fields = document.querySelectorAll('input[type=tel]');
  const phonePattern = '^(7|8)[\\s\\-]?\\(?\\d{3}\\)?[\\s\\-]?\\d{3}[\\s\\-]?\\d{2}[\\s\\-]?\\d{2}$';

  fields.forEach(field => {
    field.addEventListener('beforeinput', (e) => {
      const input = e.target;
      const value = input.value;
      const digits = value.replace(/\D/g, '');
      const isDigit = /\d/.test(e.data);
      
      if (isDigit && digits.length >= 11) {
        e.preventDefault();
      }
    });

    field.addEventListener('input', (e) => {
      const input = e.target;
      field.setAttribute('pattern', phonePattern);

      let cursorPos = input.selectionStart;
      const oldValue = input.value;

      let digits = oldValue.replace(/\D/g, '');
      
      if (digits.length > 0 && digits[0] !== '7') {
        digits = '7' + digits.slice(1);
      }
      
      if (digits.length > 11) {
        digits = digits.slice(0, 11);
      }
      
      function formatPhone(digits) {
        let formatted = '';
        if (digits.length > 0) {
          formatted += digits[0];
        }
        if (digits.length >= 2) {
          formatted += ' (' + digits.slice(1, 4);
        }
        if (digits.length >= 5) {
          formatted += ') ' + digits.slice(4, 7);
        }
        if (digits.length >= 8) {
          formatted += ' ' + digits.slice(7, 9);
        }
        if (digits.length >= 10) {
          formatted += ' ' + digits.slice(9, 11);
        }
        return formatted;
      }

      const formatted = formatPhone(digits);
      
      function countDigits(str, pos) {
        return (str.slice(0, pos).match(/\d/g) || []).length;
      }

      const digitsBeforeCursor = countDigits(oldValue, cursorPos);
      
      let newCursorPos = 0;
      let digitsCount = 0;

      while (digitsCount < digitsBeforeCursor && newCursorPos < formatted.length) {
        if (/\d/.test(formatted[newCursorPos])) {
          digitsCount++;
        }
        newCursorPos++;
      }

      input.value = formatted;
      input.setSelectionRange(newCursorPos, newCursorPos);
    });
  });
});
 