export function formatNumber(num) {
  const str_num = String(num);
  var result = '';
  var index = str_num.length - 1;
  var count = 0;
  while (index >= 0) {
    count += 1;
    const char = str_num[index];
    result = char + result;
    if (count === 3 && index !== 0) {
      count = 0;
      result = `,${result}`;
    }
    index -= 1;
  }
  return result;
}
