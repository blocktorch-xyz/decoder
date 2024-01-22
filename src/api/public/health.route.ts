import {router} from "../../app";

router.get("/api/public/health", (req: any, res: any) => {
    res.status(200).end();
});
