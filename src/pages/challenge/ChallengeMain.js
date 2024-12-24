import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BasicTable from '../../components/BasicTable';

const ChallengeMain = () => {
  const [headers] = useState(['챌린지 이름', '설명', '시작 날짜', '종료 날짜']);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryCode, setCategoryCode] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get('/api/challenges', {
          params: {
            page,
            size,
            searchKeyword,
            categoryCode,
          },
        });
        const { challenges } = response.data;
        const formattedRows = challenges.map(challenge => [
          challenge.name,
          challenge.description,
          challenge.startDate,
          challenge.endDate,
        ]);
        setRows(formattedRows);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      }
    };

    fetchChallenges();
  }, [page, size, searchKeyword, categoryCode]);

  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

  return (
    <div>
      <h1>챌린지 메인 페이지</h1>
      <BasicTable headers={headers} rows={rows} onRowClick={handleRowClick} />
    </div>
  );
};

export default ChallengeMain;