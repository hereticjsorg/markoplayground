module.exports = class {
    async onCreate() {
        this.state = {
            count: 0,
        };
    }

    async onCounterButtonClick() {
        this.setState("count", this.state.count + 1);
    }
};
