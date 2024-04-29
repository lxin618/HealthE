
import request from 'supertest';
declare global {
    namespace NodeJS {
        interface Global {
            register: () => Promise<string>;
            login: () => string;
        }
    }
}