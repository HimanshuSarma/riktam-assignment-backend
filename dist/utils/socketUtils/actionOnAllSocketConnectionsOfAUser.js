const actionOnAllSocketConnectionsOfAUser = (userId, cb) => {
    var _a, _b, _c;
    (_c = (_b = Object.entries(((_a = global === null || global === void 0 ? void 0 : global.connectedSockets) === null || _a === void 0 ? void 0 : _a[userId]) || {})) === null || _b === void 0 ? void 0 : _b.forEach) === null || _c === void 0 ? void 0 : _c.call(_b, (socketConnection) => {
        cb === null || cb === void 0 ? void 0 : cb(socketConnection === null || socketConnection === void 0 ? void 0 : socketConnection[1]);
    });
};
export { actionOnAllSocketConnectionsOfAUser };
//# sourceMappingURL=actionOnAllSocketConnectionsOfAUser.js.map