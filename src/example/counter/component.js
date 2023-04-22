module.exports = class {
    async onCreate() {
        this.state = {
            count: 0,
        };
    }

    async onCounterButtonClick(e) {
        e.preventDefault();
        this.setState("count", this.state.count + 1);
    }
};
