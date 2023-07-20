const sum = (a, b) => a+b;

test("add two numbers", () => {
    expect(sum(1,2)).toBe(3);
});