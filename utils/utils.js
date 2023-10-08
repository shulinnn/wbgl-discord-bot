function BigIntToNumber(bigInt) {
  return Number(bigInt.toString());
}

function ToIsoDateString(string) {
  const splittedInputString = string.split("/");
  const inputStringDate = new Date(
    Date.UTC(
      splittedInputString[0],
      splittedInputString[1] - 1,
      splittedInputString[2],
      splittedInputString[3],
      splittedInputString[4]
    )
  );
  return inputStringDate.toISOString();
}

module.exports = {
  BigIntToNumber,
  ToIsoDateString,
};
