export function validateInputNumber(input: any) {

    var regex = /^\d+[,]?\d{0,2}$/;

    if (regex.test(input)) {
        return input;
    } else {
        return input.substring(0, input.length - 1);
    }
}