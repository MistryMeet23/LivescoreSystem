import * as yup from "yup";

export const category = yup.object({
    categoryName: yup.string().required('Category Name is Required'),
    minAge: yup.number().required('Minimum Age is Required'),
    maxAge: yup.number().required('Maximum Age is Required'),
    minWeight: yup.number().required('Minimum Weight is Required'),
    maxWeight: yup.number().required('Maximum Weight is Required'),
});

export const tournament = yup.object({
    TournamentName: yup.string().required('Name is Required'),
    Venue: yup.string().required('Venue  is Required'),
    TournamentDate: yup.date().required('Date is required').min(new Date(), 'Date must be in the future')
        .test('is-future', 'Date must be in the future', value => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set today's date to start of day
            const selectedDate = new Date(value);
            selectedDate.setHours(0, 0, 0, 0); // Set selected date to start of day
            return selectedDate > today; // Check if selected date is greater than today
        }),
    TournamentCoordinator: yup.string().required('Coordinator is required'),
});
export const upTournament = yup.object({
    tournamentName: yup.string().required('Name is Required'),
    venue: yup.string().required('Venue  is Required'),
    tournamentDate: yup.date().required('Date is required').min(new Date(), 'Date must be in the future')
        .test('is-future', 'Date must be in the future', value => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set today's date to start of day
            const selectedDate = new Date(value);
            selectedDate.setHours(0, 0, 0, 0); // Set selected date to start of day
            return selectedDate > today; // Check if selected date is greater than today
        }),
    coordinatorName: yup.string().required('Coordinator is required'),
});