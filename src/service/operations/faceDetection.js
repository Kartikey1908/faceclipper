import toast from "react-hot-toast";
import { faceDetectionEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";


const {
    FACE_DETECTION_API
} = faceDetectionEndpoints;


export const getFaceClippedImage = async(data) => {
    console.log(data)
    let result;
    const toastId = toast.loading("Loading...");
    try {
        const response =  await apiConnector("POST", FACE_DETECTION_API, data, {
            "Content-Type": "multipart/form-data",
        })

        console.log("Face detection api response....", response);

        if (!response?.data?.success) {
            throw new Error("Could not get face clipped");
        }

        result = response?.data;
    } catch (error) {
        console.log("Face detection api error....", error);
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
}