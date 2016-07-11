import React from 'react';

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

export function getUnitThumbnailUrl(id) {
  // Aokiji is a noob.
  let slice_length = -4;
  if (id === 574 || id === 575) {
    slice_length = -5;
  }
  return `url(http://onepiece-treasurecruise.com/wp-content/uploads/f${`0000${id}`.slice(slice_length)}.png)`;
}

export function getUnitPortraitUrl(id) {
  // Aokiji is too cool for our site.
  let slice_length = -4;
  if (id === 574 || id === 575) {
    slice_length = -5;
  }
  return `url(http://onepiece-treasurecruise.com/wp-content/uploads/c${`0000${id}`.slice(slice_length)}.png)`;
}

export function wrapText(str) {
  const wrap_length = 20;
  let num_so_far = 0;
  const result = [];
  const words = str.split(' ');
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    num_so_far += word.length + 1;
    let extra_char = '';
    let push_br = false;
    if (i + 1 < words.length) {
      if (words[i + 1].length + num_so_far >= wrap_length) {
        push_br = true;
        num_so_far = 0;
      } else {
        extra_char = ' ';
      }
    }
    result.push(word + extra_char);
    if (push_br) {
      result.push(<br />);
    }
  }
  return result;
}
