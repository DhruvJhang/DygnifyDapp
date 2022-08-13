import React, { useEffect, useState } from "react";
import DocumentCard from "../../tools/Card/DocumentCard";
import { useNavigate } from "react-router";
import { retrieveFiles } from "../../services/web3storageIPFS";
import {
  getBinaryFileData,
  getDataURLFromFile,
} from "../../services/fileHelper";
import KYBModal from "./Components/Modal/KYB/KYBModal";
import { getBorrowerDetails } from "../../components/transaction/TransactionHelper";
import Twitter from "../SVGIcons/Twitter";
import LinkedIn from "../SVGIcons/LinkedIn";
import Email from "../SVGIcons/Email";
import Website from "../SVGIcons/Website";
import Edits from "../SVGIcons/Edits";
import GradientButton from "../../tools/Button/GradientButton";

const BorrowerProfile = () => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);

  const [borrowerJson, setborrowerJson] = useState();
  const [logoImgSrc, setLogoImgSrc] = useState();
  const [companyName, setCompanyName] = useState();
  const [companyRepName, setCompanyRepName] = useState();
  const [companyBio, setCompanyBio] = useState();
  const [website, setWebsite] = useState();
  const [email, setEmail] = useState();
  const [twitter, setTwitter] = useState();
  const [linkedin, setLinkedin] = useState();

  const [profileStatus, setProfileStatus] = useState(true);

  const handleForm = () => {
    setSelected(null);
  };

  const loadBlockpassWidget = () => {
    const blockpass = new window.BlockpassKYCConnect(
      process.env.REACT_APP_CLIENT_ID,
      {
        refId: "1",
      }
    );

    blockpass.startKYCConnect();

    blockpass.on("KYCConnectSuccess", () => {
      //add code that will trigger when data have been sent.
    });
  };

  useEffect(async () => {
    // make the call to get borrower specific cid to fetch the data
    // currently we'll mock the cid

    loadBlockpassWidget();

    const fetchData = async () => {
      let borrowerCID = await getBorrowerDetails();
      console.log(borrowerCID);

      if (!borrowerCID) return setProfileStatus(false);
      if (borrowerCID) {
        let data = await retrieveFiles(borrowerCID, true);

        if (data) {
          let read = getBinaryFileData(data);
          read.onloadend = function () {
            let brJson = JSON.parse(read.result);
            loadBorrowerData(brJson);
            setborrowerJson(brJson);
            console.log(brJson);
          };
        }
      }
    };
    fetchData();
  }, []);

  const fetchBorrowerLogo = (imgcid) => {
    if (imgcid) {
      try {
        retrieveFiles(imgcid, true).then((imgFile) => {
          if (imgFile) {
            let read = getDataURLFromFile(imgFile);
            read.onloadend = function () {
              setLogoImgSrc(read.result);
            };
          } else {
            // set the empty logo image
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const loadBorrowerProfileData = (profileData) => {
    if (profileData) {
      try {
        if (profileData.companyName) {
          setCompanyName(profileData.companyName);
        }
        if (profileData.companyRepName) {
          setCompanyRepName(profileData.companyRepName);
        }
        if (profileData.companyBio) {
          setCompanyBio(profileData.companyBio);
        }
        if (profileData.website) {
          setWebsite(profileData.website);
        }
        if (profileData.email) {
          setEmail("mailto:" + profileData.email);
        }
        if (profileData.twitter) {
          setTwitter(profileData.twitter);
        }
        if (profileData.linkedin) {
          setLinkedin(profileData.linkedin);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const loadBorrowerData = (jsonData) => {
    try {
      if (jsonData) {
        // Load the Logo image if there is any
        fetchBorrowerLogo(
          jsonData.companyLogoFile
            ? jsonData.companyLogoFile.businessLogoFileCID
            : jsonData.companyLogoCID
        );
        // Load rest of the data
        loadBorrowerProfileData(jsonData);

        console.log("work in progress");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const redirectToURl = (event) => {
    let url;
    console.log(event);

    switch (event.target.id) {
      case "twitter":
        url = twitter;
        break;
      case "linkedin":
        url = linkedin;
        break;
      case "website":
        url = website;
        break;
    }

    if (url) {
      let protocol = "https://";
      let position = url.search(protocol);
      // if there is no "https://" in the url then it is not opened correctly
      if (position === -1) {
        url = protocol + url;
      }
      window.open(url, "_blank");
    }
  };

  const redirectForEmail = () => {
    if (email) {
      window.location.href = email;
    }
  };

  return (
    <>
      <div className="mb-16 ">
        {selected && <KYBModal handleForm={handleForm} />}
        {!profileStatus && (
          <div className="flex-col " style={{ display: "flex" }}>
            <div
              className="flex-row justify-between items-start"
              style={{ display: "flex" }}
            >
              <h2 className="mb-6 text-2xl font-medium">Borrower Profile</h2>
              <div
                style={{ display: "flex", marginRight: 15 }}
                className="flex-row justify-center items-center"
              >
                <button
                  onClick={() =>
                    navigate("/borrower_dashboard/edit_profile", borrowerJson)
                  }
                  style={{
                    borderRadius: "100px",
                    padding: "8px 16px",
                    display: "flex",
                  }}
                  className="btn btn-sm btn-outline text-white "
                >
                  <div style={{ marginRight: 2 }}>Create Profile</div>
                  <Edits />
                </button>
              </div>
            </div>
            <p
              className="justify-center"
              style={{ color: "#64748B", display: "flex", marginTop: 40 }}
            >
              Complete your profile.
            </p>
          </div>
        )}
        {profileStatus ? (
          <>
            <div
              style={{ display: "flex" }}
              className="justify-between items-center mb-6"
            >
              <div style={{ display: "flex" }}>
                <div class="avatar">
                  <div class="w-16 rounded-full">
                    <img src={logoImgSrc} />
                  </div>
                </div>
                <div
                  style={{ display: "flex" }}
                  className="flex-col justify-center ml-4"
                >
                  <h4 style={{ fontSize: 23 }}>{companyName}</h4>
                  <p style={{ fontSize: 19, color: "#B8C0CC" }}>
                    {companyRepName}
                  </p>
                </div>
              </div>
              <div
                style={{ display: "flex" }}
                className="flex-row justify-center items-center"
              >
                <button
                  onClick={() =>
                    navigate("/borrower_dashboard/edit_profile", {
                      state: borrowerJson,
                    })
                  }
                  style={{
                    borderRadius: "100px",
                    padding: "8px 16px",
                    display: "flex",
                  }}
                  className="btn btn-sm btn-outline text-white "
                >
                  <div style={{ marginRight: 3 }}>Edit Profile</div>
                  <Edits />
                </button>
              </div>
            </div>

            <div
              className="flex-row w-full mt-10 mb-10 gap-4"
              style={{ display: "flex" }}
            >
              <label
                className="w-1/2"
                style={{
                  borderWidth: 1,
                  borderRightWidth: 20,
                  borderColor: "#5375FE",
                  borderRadius: "16px",
                  padding: "14px",
                  paddingRight: "60px",
                  cursor: "pointer",
                }}
                id="blockpass-kyc-connect"
              >
                <div style={{ marginBottom: 4, fontSize: 19, fontWeight: 600 }}>
                  Complete your KYC
                </div>
                <div style={{ lineHeight: "19px" }}>
                  For Individuals - KYC verification includes verification of
                  Identity Details and document verification such as utility
                  bills as proof of address. Verifying your details ensures that
                  you have a smooth and secure experience with us.
                </div>
              </label>
              {/* <label
                htmlFor="kybModal"
                className="w-1/2"
                style={{
                  borderWidth: 1,
                  borderRightWidth: 20,

                  borderColor: "#5375FE",
                  borderRadius: "16px",
                  padding: "14px",
                  paddingRight: "60px",
                  cursor: "pointer",
                }}
                onClick={() => setSelected(true)}
              >
                <div style={{ marginBottom: 4, fontSize: 19, fontWeight: 600 }}>
                  Complete your KYB
                </div>
                <div style={{ lineHeight: "19px" }}>
                  For Entities - KYB verification includes Identity and
                  incorporation verification of your business. Verfifying your
                  details ensures that you have a smooth and secure experience
                  with us.
                </div>
              </label> */}
            </div>

            <div
              style={{ display: "flex" }}
              className="w-full justify-between items-center mb-6"
            >
              <div className="w-1/2">
                <h5 className="text-lg" style={{ fontSize: 23 }}>
                  Socials
                </h5>
              </div>
              <div style={{ display: "flex" }} className="w-1/2 justify-end">
                {twitter ? (
                  <button
                    id="twitter"
                    style={{
                      borderRadius: "100px",
                      padding: "8px 16px",
                      border: "1px solid #64748B",
                    }}
                    className="ml-3 btn btn-sm btn-outline text-white"
                    onClick={redirectToURl}
                  >
                    <Twitter />
                    <div style={{ marginLeft: 2 }}>twitter</div>
                  </button>
                ) : (
                  <></>
                )}
                {linkedin ? (
                  <button
                    id="linkedin"
                    style={{
                      borderRadius: "100px",
                      padding: "8px 16px",
                      border: "1px solid #64748B",
                    }}
                    className="ml-3 btn btn-sm btn-outline text-white"
                    onClick={redirectToURl}
                  >
                    <LinkedIn />
                    <div style={{ marginLeft: 2 }}>LinkedIn</div>
                  </button>
                ) : (
                  <></>
                )}
                {email ? (
                  <button
                    id="email"
                    style={{
                      borderRadius: "100px",
                      padding: "8px 16px",
                      border: "1px solid #64748B",
                    }}
                    className="ml-3 btn btn-sm btn-outline text-white"
                    onClick={redirectForEmail}
                  >
                    <Email />
                    <div style={{ marginLeft: 2 }}>Email</div>
                  </button>
                ) : (
                  <></>
                )}
                {website ? (
                  <button
                    id="website"
                    style={{
                      borderRadius: "100px",
                      padding: "8px 16px",
                      border: "1px solid #64748B",
                    }}
                    className="ml-3 btn btn-sm btn-outline text-white"
                    onClick={redirectToURl}
                  >
                    <Website />
                    <div style={{ marginLeft: 2 }}>Website</div>
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="mb-6">
              <h5 className="text-lg" style={{ fontSize: "23px" }}>
                Bio
              </h5>
              <p
                className="text-sm font-light text-justify"
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  lineHeight: "28px",
                  color: "#E6E6E6",
                }}
              >
                {companyBio}
              </p>
            </div>

            {/* <div className="mb-6">
              <h5 className="text-lg">KYC Details</h5>
              <DocumentCard docName={"Aadhar Card.pdf"} />
              <DocumentCard docName={"Passport.pdf"} />
            </div> */}
            <div className="mb-6">
              <h5 className="text-lg">KYB Details</h5>
              <h6 style={{ marginTop: 10, marginBottom: 3, color: "#64748B" }}>
                Business Identify Proof
              </h6>
              <DocumentCard
                docName={
                  borrowerJson
                    ? borrowerJson.businessIdFile.businessIdDocName
                    : ""
                }
                docCid={
                  borrowerJson
                    ? borrowerJson.businessIdFile.businessIdFileCID
                    : null
                }
                fileName={
                  borrowerJson
                    ? borrowerJson.businessIdFile.businessIdFileName
                    : null
                }
              />

              <h6 style={{ marginTop: 10, marginBottom: 3, color: "#64748B" }}>
                Business Address Proof
              </h6>
              <DocumentCard
                docName={
                  borrowerJson
                    ? borrowerJson.businessAddFile.businessAddDocName
                    : ""
                }
                docCid={
                  borrowerJson
                    ? borrowerJson.businessAddFile.businessAddFileCID
                    : null
                }
                fileName={
                  borrowerJson
                    ? borrowerJson.businessAddFile.businessAddFileName
                    : null
                }
              />
              <h6 style={{ marginTop: 10, marginBottom: 3, color: "#64748B" }}>
                Business License Proof
              </h6>
              <DocumentCard
                docName={
                  borrowerJson
                    ? borrowerJson.businessLicFile.businessLicDocName
                    : ""
                }
                docCid={
                  borrowerJson
                    ? borrowerJson.businessLicFile.businessLicFileCID
                    : null
                }
                fileName={
                  borrowerJson
                    ? borrowerJson.businessLicFile.businessLicFileName
                    : null
                }
              />
              <h6 style={{ marginTop: 10, marginBottom: 3, color: "#64748B" }}>
                Business Incorporation Proof
              </h6>
              <DocumentCard
                docName={
                  borrowerJson
                    ? borrowerJson.businessIncoFile.businessIncoDocName
                    : ""
                }
                docCid={
                  borrowerJson
                    ? borrowerJson.businessIncoFile.businessIncoFileCID
                    : null
                }
                fileName={
                  borrowerJson
                    ? borrowerJson.businessIncoFile.businessIncoFileName
                    : null
                }
              />
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default BorrowerProfile;
