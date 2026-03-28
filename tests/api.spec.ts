import test, { expect } from '../myFixture';
    //TODO: add AUTH, UPDATE & DELETE STEPS

    //adjusting the url for the API tests (specifically for this file)
test.use({
    baseURL: 'https://restful-booker.herokuapp.com/'
})

test('E2E Booking Workflow', async({ bookingController }) => {
    let bookingId: number;
    let authToken: string;

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
        expect.soft(postresponseBody.booking).toHaveProperty('firstname', 'Josh');
        expect.soft(postresponseBody.booking).toHaveProperty('lastname', 'Matthews');
        expect.soft(postresponseBody.booking.bookingdates).toHaveProperty('checkin', '2026-05-01');
        expect.soft(postresponseBody.booking.bookingdates).toHaveProperty('checkout', '2026-05-03');
        console.log(JSON.stringify(postresponseBody));

        bookingId = postresponseBody.bookingId;
    });

    await test.step('Doublecheck if the created booking really exists', async() => {
        const checkResponse = await bookingController.checkBooking(bookingId);
        const checkResponseBody = await checkResponse.json();
        console.log('The booking created in the previous response possesses of the following qualitites: ', JSON.stringify(checkResponseBody));
    })

})