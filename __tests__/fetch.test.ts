import { describe, it, expect } from "vitest"
import { ofetch } from "ofetch"

describe("ofetch", () => {
    it("should fetch data", async () => {
        const data = await ofetch("https://jsonplaceholder.typicode.com/posts/1")
        expect(data.userId).toBe(1)
    })
})