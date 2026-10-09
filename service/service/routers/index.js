import petRouter from "./pet-router.js";
import ngoRouter from "./ngo-router.js";
import userRouter from "./user-router.js";
import foodProductRouter from "./foodProduct-router.js";
import fundraiserRouter from "./fundraiser-router.js";
import breedRouter from "./breed-router.js";

const initializeRoutes = (app) => {
    app.use('/pets', petRouter);
    app.use("/ngos", ngoRouter);
    app.use('/user', userRouter);
    app.use('/foodProduct', foodProductRouter);
    app.use("/api/fundraisers", fundraiserRouter);
    app.use("/breeds", breedRouter);
};

export default initializeRoutes;
