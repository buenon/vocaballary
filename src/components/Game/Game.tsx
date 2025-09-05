import styled from "styled-components";
import { HoopProvider } from "../../contexts/HoopContext";
import BasketballBoard from "../BasketballBoard/BasketballBoard";
import Layout from "../Layout/Layout";

const CourtLayer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export default function Game() {
  return (
    <HoopProvider>
      <Layout>
        <CourtLayer>
          <BasketballBoard />
        </CourtLayer>
      </Layout>
    </HoopProvider>
  );
}
