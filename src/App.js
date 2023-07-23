import "./styles.css";
// import {Components} from '@mui/material';
import { Box, styled } from "@mui/material";
import WeekwiseRepo from "./components/WeekwiseRepo";

export default function App() {
  return (
    <div className="App">
      <Header>Most Stared Repos</Header>
      <WeekwiseRepo />
    </div>
  );
}

const Header = styled("h1")`
  background: #000;
  color: #ffffff;
  padding: 15px;
  margin-top: 10px;
`;
