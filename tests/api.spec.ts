import test, { expect } from '../myFixture';
    //TODO: add AUTH, UPDATE & DELETE STEPS

    //adjusting the url for the API tests (specifically for this file)
test.use({
    baseURL: 'https://restful-booker.herokuapp.com/'
})

let authToken: string;

test.beforeEach('Get auth token', async ({ bookingController}) => {
    authToken = await bookingController.getMyToken('admin', 'password123');
    expect(authToken).toBeDefined();
})
    
test('E2E Booking Workflow', async({ bookingController }) => {
    let bookingId: number;

    await test.step('Create a booking', async() => {
        const newBooking = {
            firstname: 'Josh',
            lastname: 'Matthews',
            totalprice: 1000,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-05-01',
                checkout: '2026-05-03'
            },
            additionalneeds: 'Some great ducks please'
        }

        const postresponse = await bookingController.createBooking(newBooking);
        console.log('The response status of the POST API euqlas: ', postresponse.status());
        expect(postresponse.ok()).toBeTruthy();
        expect(postresponse.status()).toBe(200);

        const postresponseBody = await postresponse.json();
        expect.soft(postresponseBody.booking).toHaveProperty('firstname', newBooking.firstname);
        expect.soft(postresponseBody.booking).toHaveProperty('lastname', newBooking.lastname);
        expect.soft(postresponseBody.booking.bookingdates).toHaveProperty('checkin', newBooking.bookingdates.checkin);
        expect.soft(postresponseBody.booking.bookingdates).toHaveProperty('checkout', newBooking.bookingdates.checkout);
        console.log(JSON.stringify(postresponseBody));

        bookingId = postresponseBody.bookingid;
    });

    await test.step('Doublecheck if the created booking really exists', async() => {
        console.log(`The booking id searched for is `, bookingId);
        const checkResponse = await bookingController.checkBooking(bookingId);
        expect.soft(checkResponse.ok()).toBeTruthy();
        expect.soft(checkResponse.status()).toBe(200);
        const checkResponseBody = await checkResponse.json();
        console.log('The booking created in the previous response disposes of the following qualitites: ', JSON.stringify(checkResponseBody));
    })

    await test.step('Updating the created booking after authentication', async() => {
        const updatedBooking = {
            firstname: 'Josh',
            lastname: 'Matthews',
            totalprice: 1200,
            depositpaid: true,
            bookingdates: {
                checkin: '2026-05-02',
                checkout: '2026-05-04'
            },
            additionalneeds: 'Vegan food'
        };

        const updatedResponse = await bookingController.updateBooking(bookingId, updatedBooking, authToken);
        expect.soft(updatedResponse.ok()).toBeTruthy();
        expect.soft(updatedResponse.status()).toBe(200);
        const updatedResponseBody = await updatedResponse.json();
        console.log(`The booking with id ${bookingId} has been successfully updated as follows: `, JSON.stringify(updatedResponseBody));
        expect.soft(updatedResponseBody.totalprice).toBe(1200);
        expect.soft(updatedResponseBody.bookingdates.checkin).toBe(updatedBooking.bookingdates.checkin);
        expect.soft(updatedResponseBody.bookingdates.checkout).toBe(updatedBooking.bookingdates.checkout);
        expect.soft(updatedResponseBody.additionalneeds).toBe(updatedBooking.additionalneeds);
    })

    await test.step('Partially updated the booking', async () => {
        const theUpdates = {
            lastname: 'Havasi',
            totalprice: 200
        };

        const partiallyUpdatedResponse = await bookingController.partiallyUpdateBooking(bookingId, theUpdates, authToken);
        expect.soft(partiallyUpdatedResponse.ok()).toBeTruthy();
        expect.soft(partiallyUpdatedResponse.status()).toBe(200);
        const partiallyUpdatedResponseBody = await partiallyUpdatedResponse.json();
        console.log(`The booking with ${bookingId} has been successfully partially updated as follows: `, JSON.stringify(partiallyUpdatedResponseBody));
        expect.soft(partiallyUpdatedResponseBody.lastname).toBe('Havasi');
        expect.soft(partiallyUpdatedResponseBody.totalprice).toBe(200);

    })

    await test.step('Deleting the booking after authentication', async() => {
        const deleteResponse = await bookingController.deleteBooking(bookingId, authToken);
        expect.soft(deleteResponse.ok()).toBeTruthy();
        expect.soft(deleteResponse.status()).toBe(201);
        console.log(`The booking with id ${bookingId} has been successfully deleted`);
    })

})