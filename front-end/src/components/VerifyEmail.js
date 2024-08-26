import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { AppContext } from "../AppContext";
const Wrapper = styled.section``;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyPage = () => {
  const [error, setError] = useState(false);
  const query = useQuery();
  const { isLoading } = useContext(AppContext);
  const { backendDomain } = useContext(AppContext);

  const verifyToken = async () => {
    try {
      const { data } = await axios.post(
        `${backendDomain}/api/v1/auth/verify-email`,
        {
          verificationToken: query.get("token"),
          email: query.get("email"),
        }
      );
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("verifying token now!!!");
    verifyToken();
  }, [isLoading]);

  if (error) {
    return (
      <Wrapper className="page">
        <h4>There was an error, please double check your verification link</h4>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="page">
      <h2>Account confirmed</h2>
      <Link to="/login">Please proceed to login!!!</Link>
    </Wrapper>
  );
};

export default VerifyPage;
