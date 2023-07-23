import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { List } from "@mui/material";
import styled from "@emotion/styled";
import DropDown from "./DropDown";

// mui

const WeekwiseRepo = () => {
  const [timePeriod, setTimePeriod] = useState(30);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [commitActivity, setCommitActivity] = useState(null);

  useEffect(() => {
    fetchRepositories(timePeriod);
  }, [timePeriod]);

  const fetchRepositories = async (timePeriod) => {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - timePeriod);
    const formattedPastDate = pastDate.toISOString().slice(0, 10);

    const apiUrl = `https://api.github.com/search/repositories?q=created:>${formattedPastDate}&sort=stars&order=desc`;

    try {
      const response = await axios.get(apiUrl);
      setRepositories(response.data.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCommitActivity = async (owner, repo) => {
    const commitActivityUrl = `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`;

    try {
      const response = await axios.get(commitActivityUrl);
      setCommitActivity(response.data);
    } catch (error) {
      console.error("Error fetching commit activity data:", error);
    }
  };

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const handleRepoClick = (owner, repo) => {
    setSelectedRepo({ owner, repo });
    fetchCommitActivity(owner, repo);
  };

  const repoList = repositories.map((repo) => (
    <List>
      <Item
        key={repo.id}
        onClick={() => handleRepoClick(repo.owner.login, repo.name)}
      >
        <Banner src={repo.owner.avatar_url} alt={repo.owner.login} />
        <Wrapper>
          <Header>{repo.name}</Header>
          <Description>{repo.description}</Description>
          <Rating>Stars: {repo.stargazers_count}</Rating>
          <Issue>Issues: {repo.open_issues}</Issue>
          <Owner>Owner: {repo.owner.login}</Owner>
          <DropDown />
        </Wrapper>
      </Item>
    </List>
  ));

  const commitActivityData = commitActivity
    ? {
        labels: commitActivity.map((weekData) =>
          new Date(weekData.week * 1000).toLocaleDateString()
        ),
        datasets: [
          {
            label: "Total Changes",
            data: commitActivity.map((weekData) => weekData.total),
            borderColor: "#007bff",
            backgroundColor: "rgba(0, 123, 255, 0.2)",
            fill: true
          }
          // Add additional datasets for individual contributors if needed
        ],
        options: {
          scales: {
            x: {
              type: "time", // Specify the type of scale for x-axis
              time: {
                unit: "week" // Set the unit for the time scale (week in this case)
              }
            }
          }
        }
      }
    : null;

  return (
    <div>
      <select value={timePeriod} onChange={handleTimePeriodChange}>
        <option value="7">1 week</option>
        <option value="14">2 weeks</option>
        <option value="30">1 month</option>
      </select>
      <ul>{repoList}</ul>
      {selectedRepo && (
        <div>
          <h2>
            Commit Activity for {selectedRepo.owner}/{selectedRepo.repo}
          </h2>
          {commitActivityData && (
            <div>
              <h3>Total Changes</h3>
              <Line data={commitActivityData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeekwiseRepo;

// stylepart

const Item = styled("li")`
  display: flex;
  margin-top: 10px;
  max-width: 100%;
  min-width: 50%;
  height: 50vh;
  border: 1px solid black;
  padding: 15px;
`;
const Banner = styled("img")`
  width: 100px;
  height: 100px;
`;

const Wrapper = styled("div")`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-left: 10px;
`;
const Header = styled("h2")`
  max-width: 100%;
`;
const Description = styled("p")`
  margin: 0px 0px 20px 20px;
  min-width: 50%;
  max-height: 10px;
  margin-bottom: 30px;
`;
const Rating = styled("p")`
  border: 0.5px solid gray;
  width: 100px;
  padding: 5px;
  float: left;
  margin-left: -140px;
  position: relative;
  margin-bottom: -45px;
`;
const Issue = styled("p")`
  border: 0.5px solid gray;
  width: 100px;
  padding: 5px;
  float: right;
  position: relative;
  margin-left: 155px;
`;
const Owner = styled("h4")`
  margin: 0px 0px 15px 0px;
`;
