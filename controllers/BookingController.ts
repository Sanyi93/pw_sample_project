import { APIRequestContext } from "@playwright/test";

export class BookingController{
    constructor ( private request : APIRequestContext){}

    //TODO: adjust the URL in the testfile for api test

    async createBooking(bookingData: object){
        const response = await this.request.post('/booking', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: bookingData,
        });
        return response;
    }

    async checkBooking(bookingId: number){
        const response = await this.request.get(`booking/${bookingId}`);
        return response;
    }

    async getMyToken(username: string, password: string): Promise<string> {
        const response = await this.request.post('/auth', {
            headers: {
                'Conent-Type': 'application/json',
                },
            data: {
                username: username,
                password: password
            }
        });

        const responseBody = await response.json();
        return responseBody.token;
    }

    async updateBooking(bookingId: number, updatedBooking: object, authToken: string){
        const response = await this.request.put(`/booking/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `token=${authToken}`
            },
            data: {
                updatedBooking
            }
        });
        return response;
    }

    async deleteBooking(bookingId: number, authToken: string){
        const response = await this.request.delete(`/booking${bookingId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${authToken}`
            }
        });
        return response;
    }
}