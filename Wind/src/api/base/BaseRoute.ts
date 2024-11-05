import WindApi from "../index";
import {
    Request,
    Response,
} from "express";

interface IMethods {
    path?: string,
    method: 'Get' | 'Post' | 'Put' | 'Delete',
    run: (api: WindApi, req: Request, res: Response) => Promise<any>
}

export default abstract class BaseRoute {
    constructor(
        public readonly path: string,
        public readonly methods: IMethods[]
    ) {}
}