import {
    AboutCoursePage,
    CertPage,
    CourseLearningPage,
    CourseListingPage,
    GenerateCertPage,
    Homepage,
    MessagingInner,
    MessagingPage,
    MyProfilePage,
    NotificationsPage,
    OthersProfilePage,
    ProfileViewer,
    UploadPage,
    WalletPage,
    PostViewer,
} from "../pages/STUDENT";
import { URL } from "../utils/constants";

const studentRoutes = [
    {
        path: URL.HOME,
        index: true,
        element: (<Homepage/>),
        name: 'Home',
    },
    {
        path: URL.POST_DETAIL + ":id",
        element: (<PostViewer />),
        name: 'Post Detail',
    },
    {
        path: URL.COURSELISTING,
        element: (<CourseListingPage/>),
        name: 'Course_Listing',
    },
    {
        path: URL.ABOUTCOURSE + ":id",
        element: (<AboutCoursePage/>),
        name: 'Course_Details',
    },
    {
        path: URL.LEARNING,
        element: <CourseLearningPage />,
        name: 'Course_Learning',
    },
    {
        path: URL.PROFILE,
        element: <MyProfilePage />,
        name: 'Profile',
    },
    {
        path: URL.BIO,
        element: <OthersProfilePage />,
        name: 'Friend Profile',
    },
    {
        path: "/profile/me",
        element: <ProfileViewer />,
        name: 'My Profile (View)',
    },
    {
        path: URL.USER_PROFILE,
        element: <ProfileViewer />,
        name: 'Public Profile',
    },
    {
        path: URL.WALLET,
        element: <WalletPage />,
        name: 'Wallet',
    },
    {
        path: URL.GENERATE_CERTIFICATE,
        element: <GenerateCertPage />,
        name: 'Certificate',
    },
    {
        path: URL.CERTIFICATE_VIEW,
        element: <CertPage />,
        name: 'My Certificate',
    },
    {
        path: URL.CERTIFICATE_PUBLIC,
        element: <CertPage />,
        name: 'Public Certificate',
    },
    {
        path: URL.NOTIFICATION,
        element: <NotificationsPage />,
        name: 'Notifications',
    },
    {
        path: URL.UPLOAD,
        element: <UploadPage />,
        name: 'Upload',
    },
    {
        path: URL.MESSAGING,
        element: <MessagingPage />,
        name: 'Messaging',
    },
    {
        path: URL.MESSAGING + "/:id",
        element: <MessagingInner />,
        name: 'Messaging Inner',
    },
        
]

export default studentRoutes;