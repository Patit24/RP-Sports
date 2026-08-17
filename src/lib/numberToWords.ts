/**
 * Convert number into Indian Currency Words (Lakhs / Crores standard)
 * Example: 849 -> "Rupees Eight Hundred Forty Nine Only."
 * Example: 1072134 -> "Rupees Ten Lakh Seventy Two Thousand One Hundred Thirty Four Only."
 */
export function numberToIndianRupeesWords(amount: number): string {
  if (!amount || isNaN(amount) || amount === 0) {
    return "Rupees Zero Only.";
  }

  const roundedAmount = Math.round(amount);

  const units = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function convertTwoDigits(num: number): string {
    if (num === 0) return "";
    if (num < 20) return units[num];
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    return `${tens[ten]}${unit > 0 ? " " + units[unit] : ""}`;
  }

  function convertThreeDigits(num: number): string {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    let result = "";
    if (hundred > 0) {
      result += `${units[hundred]} Hundred`;
      if (remainder > 0) result += " ";
    }
    if (remainder > 0) {
      result += convertTwoDigits(remainder);
    }
    return result;
  }

  let num = roundedAmount;
  let words = "";

  // Crores (1,00,00,000)
  const crore = Math.floor(num / 10000000);
  if (crore > 0) {
    words += `${convertTwoDigits(crore)} Crore `;
    num %= 10000000;
  }

  // Lakhs (1,00,000)
  const lakh = Math.floor(num / 100000);
  if (lakh > 0) {
    words += `${convertTwoDigits(lakh)} Lakh `;
    num %= 100000;
  }

  // Thousands (1,000)
  const thousand = Math.floor(num / 1000);
  if (thousand > 0) {
    words += `${convertTwoDigits(thousand)} Thousand `;
    num %= 1000;
  }

  // Remaining (Hundreds, Tens, Units)
  if (num > 0) {
    words += convertThreeDigits(num);
  }

  return `Rupees ${words.trim()} Only.`;
}
