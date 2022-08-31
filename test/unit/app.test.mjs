import pkg from 'chai';
const { expect } = pkg;
import { checkIfTextIsLink } from '../../utils.mjs';

describe(("#checkIfTextIsLink"), () => {
    describe('input is url link', () => {
        const result = checkIfTextIsLink("https://t.co/0332wfGiFG")
        it("should return true", () => {
            expect(result).to.equal(true)
        })
    })
    describe('input is url link 2', () => {
        const result = checkIfTextIsLink("t.co/0332wfGiFG")
        it("should return true", () => {
            expect(result).to.equal(true)
        })
    })
    describe('input is url link with text', () => {
        const result = checkIfTextIsLink("abcde https://t.co/0332wfGiFG")
        it("should return true", () => {
            expect(result).to.equal(false)
        })
    })
    describe('input is url link with text at the end', () => {
        const result = checkIfTextIsLink("https://t.co/0332wfGiFG abcde")
        it("should return true", () => {
            expect(result).to.equal(false)
        })
    })
    describe('input is url link with text at the end 2', () => {
        const result = checkIfTextIsLink("https://t.co/0332wfGiFG abcde sadasdasd")
        it("should return true", () => {
            expect(result).to.equal(false)
        })
    })
    describe('input is text', () => {
        const result = checkIfTextIsLink("abcde")
        it("should return true", () => {
            expect(result).to.equal(false)
        })
    })
})