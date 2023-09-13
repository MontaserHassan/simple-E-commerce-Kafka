import  IUser from '../interfaces/user.interface';


declare global{
    namespace Express {
        interface Request {
            user?: IUser | undefined,
        }
        interface ProcessEnv {
            PORT?: number;
            DATABASE_URL?: string;
            JWT_SECRET? : string;     
        }
    }
    
}