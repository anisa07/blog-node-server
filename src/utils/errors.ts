import express from "express";

export const serverError = (res: express.Response) => res.status(500).send({
    type: 'ERROR',
    message: 'Server error'
})
