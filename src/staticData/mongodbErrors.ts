interface mongoErrorType {
    [key: number]: string
};

const mongoErrors: mongoErrorType = {
    11000: "Duplicate values"
}

export { mongoErrors };