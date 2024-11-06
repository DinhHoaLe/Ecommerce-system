// Hàm chuyển đổi số thành chữ (tiếng Việt)
function convertNumberToWords(number) {
  const units = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const tens = [
    "",
    "",
    "hai mươi",
    "ba mươi",
    "bốn mươi",
    "năm mươi",
    "sáu mươi",
    "bảy mươi",
    "tám mươi",
    "chín mươi",
  ];
  const scales = ["", "nghìn", "triệu", "tỷ"];

  if (number === 0) return "không";

  let words = "";
  let scale = 0;

  while (number > 0) {
    let chunk = number % 1000;
    if (chunk) {
      let chunkWords = "";
      let hundreds = Math.floor(chunk / 100);
      let remainder = chunk % 100;
      let tensDigit = Math.floor(remainder / 10);
      let unitsDigit = remainder % 10;

      if (hundreds) {
        chunkWords += units[hundreds] + " trăm ";
        if (remainder === 0) chunkWords += " ";
      }
      if (tensDigit) {
        chunkWords += tens[tensDigit] + " ";
      } else if (remainder > 0) {
        chunkWords += "lẻ ";
      }
      if (unitsDigit) {
        chunkWords += units[unitsDigit] + " ";
      }
      words = chunkWords + scales[scale] + " " + words;
    }
    number = Math.floor(number / 1000);
    scale++;
  }

  return words.trim();
}

export default convertNumberToWords;
