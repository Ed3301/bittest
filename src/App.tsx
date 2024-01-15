import React, { useEffect, useState } from 'react';
import './App.css';
import {styled} from "@mui/material/styles";
import Header from './components/Header';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/SearchRounded';
import Close from '@mui/icons-material/Close';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Pagination from '@mui/material/Pagination';
import { Api } from './api/index';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';
import { Line } from "react-chartjs-2";
import Stack from '@mui/material/Stack';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
);

interface HeadCell {
    label: string;
    name: string;
    numeric: boolean;
}

type orderType = "desc" | "asc" | undefined;

const MainContainer = styled('section')({
    background: '#121825',
    borderRadius: 17,
    padding: 20,
    marginTop: 30
});
const SearchField = styled(TextField)({
    width: '100%',
    color: 'white',
    borderRadius: 8,
    padding: '10px 20px',
    'fieldset': {
        borderColor: '#222B44',
    }
});
const StyledTableCell = styled(TableCell)({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#0E0C15',
        color: '#9CA3AF',
        '.Mui-active, svg': {
            color: 'white',
        },
        '.MuiTableSortLabel-root:hover': {
            color: 'white',
        }
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: 'white',
        '.Mui-active': {
            color: 'white',
        }
    },
});
const MyPagination = styled(Pagination)({
    '& .MuiPagination-ul button': {
        color: 'white'
    },
    '& .MuiPagination-ul': {
        justifyContent: 'center'
    }
});
const MyDrawer = styled(Drawer)({
    '& .MuiDrawer-paper': {
        background: '#121825',
        padding: '20px'
    },
});

const headCells: readonly HeadCell[] = [
    {
        numeric: false,
        label: 'Email',
        name: 'email'
    },
    {
        numeric: false,
        label: 'Имя',
        name: 'name'
    },
    {
        numeric: false,
        label: 'Роль',
        name: 'role'
    },
    {
        numeric: false,
        label: 'Подписка',
        name: 'subscription'
    },
    {
        numeric: true,
        label: 'Токены',
        name: 'tokens'
    },
    {
        numeric: false,
        label: 'Действия',
        name: 'actions'
    },
];
const headCellsTrans: readonly HeadCell[] = [
    {
        numeric: false,
        label: 'Тип',
        name: 'type'
    },
    {
        numeric: false,
        label: 'Сумма',
        name: 'sum'
    },
    {
        numeric: false,
        label: 'Дата',
        name: 'date'
    }
];

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom' as const,
        }
    },
};

function App() {
    const [users, setUsers] = useState<any>([]);
    const [searchText, setSearchText] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [order, setOrder] = useState<orderType>('asc');
    const [orderBy, setOrderBy] = useState<string>('name');
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<any>({});
    const [transactions, setTransactions] = useState<any>([]);

    const chartData:any = {
        labels: transactions.map((obj:any) => obj.created_at.substring(0, 10)),
        datasets: [
            {
                label: selectedUser.email,
                data: transactions.map((obj:any) => obj.amount),
                borderColor: '#1C64F2',
                backgroundColor: '#1C64F2',
            }
        ],
    };

    const getUsers = async () => {
        const res: any = await Api.getUsers(page, searchText);
        setUsers(res.data.data);
        setTotalPages(res.data.pages);
    }

    const getTransactions = async (id: string) => {
        const res: any = await Api.getTransactions(id);
        setTransactions(res.data);
    }

    useEffect(() => {
        getUsers();
    }, [page, searchText]);

    const handleSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedRows = users.sort((a: any, b: any) => {
        const isAsc = order === 'asc';
        if (isAsc) {
            if(orderBy == 'subscription') {
                return a.subscription.plan.type > b.subscription.plan.type ? 1 : -1;
            } else if (orderBy == 'tokens') {
                return a.subscription.tokens > b.subscription.tokens ? 1 : -1;
            }
            return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
            if(orderBy == 'subscription') {
                return a.subscription.plan.type < b.subscription.plan.type ? 1 : -1;
            } else if (orderBy == 'tokens') {
                return a.subscription.tokens < b.subscription.tokens ? 1 : -1;
            }
            return a[orderBy] < b[orderBy] ? 1 : -1;
        }
    });

    const clickUser = async (user: any) => {
        setSelectedUser(user);
        await getTransactions(user.id);
        setDrawerOpen(true);
    }

  return (
    <div className="App">
        <Header />
        <MyDrawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                color="white"
            >
                <Typography
                    sx={{
                        color: 'white',
                        padding: '20px',
                    }}
                >
                    {selectedUser.email}
                </Typography>
                <Close
                    cursor="pointer"
                    onClick={() => setDrawerOpen(false)}
                />
            </Stack>
            <Typography
                noWrap
                sx={{
                    fontSize: 22,
                    color: 'white',
                    padding: '23px',
                }}
            >
                Использование токенов
            </Typography>
            <Line options={chartOptions} data={chartData} />
            <Typography
                noWrap
                sx={{
                    fontSize: 22,
                    color: 'white',
                    padding: '23px',
                }}
            >
                История операций
            </Typography>
            <TableContainer style={{padding: '20px', width: '100%'}}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            {headCellsTrans.map((cell) => (
                                <StyledTableCell align="center" key={cell.label}>
                                    {cell.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((row: any) => (
                            <TableRow
                                hover
                                key={row.name}
                            >
                                <StyledTableCell align="center">
                                    {row.type == 'WRITE_OFF' ? 'Списание' : 'Пополнение'}
                                </StyledTableCell>
                                <StyledTableCell
                                    align="center"
                                    style={{
                                        color: row.type == 'WRITE_OFF' ? 'red' : 'green'
                                    }}
                                >
                                    {row.type == 'WRITE_OFF' ? ('-' + row.amount) : ('+' + row.amount)} BTKN
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.created_at.substring(0, 19).replace('T', ', ')}
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MyDrawer>
        <MainContainer>
            <Typography
                noWrap
                sx={{
                    width: '100%',
                    fontSize: 22,
                    color: 'white',
                    borderBottom: '1px solid #222B44',
                    padding: '20px'
                }}
            >
                Моя организация
            </Typography>
            <Typography
                noWrap
                sx={{
                    width: '100%',
                    fontSize: 22,
                    color: 'white',
                    padding: '20px'
                }}
            >
                Пользователи
            </Typography>
            <SearchField
                variant="outlined"
                placeholder="Поиск"
                type="search"
                value={searchText}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchText(event.target.value);
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search style={{color: '#222B44'}} />
                        </InputAdornment>
                    ),
                    style: { color: 'white' },
                }}
            />
            <TableContainer style={{padding: '20px'}}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <StyledTableCell
                                    key={headCell.label}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.name}
                                        onClick={() => handleSort(headCell.name)}
                                        direction={orderBy === headCell.name ? order : 'asc'}
                                    >
                                        {headCell.label}
                                        {orderBy === headCell.name ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRows.map((row: any) => (
                            <TableRow
                                hover
                                sx={{ cursor: 'pointer' }}
                                key={row.name}
                                onClick={() => clickUser(row)}
                            >
                                <StyledTableCell>{row.email}</StyledTableCell>
                                <StyledTableCell>{row.name}</StyledTableCell>
                                <StyledTableCell>{row.role}</StyledTableCell>
                                <StyledTableCell>{row.subscription.plan.type}</StyledTableCell>
                                <StyledTableCell>{row.subscription.tokens}</StyledTableCell>
                                <StyledTableCell>
                                    <Edit fontSize="small" color="primary" />
                                    <Delete fontSize="small" color="primary" />
                                </StyledTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <MyPagination
                style={{
                    color: 'white',
                    textAlign: 'center'
                }}
                count={totalPages}
                page={page}
                onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                    setPage(value);
                }}
                color="primary"
                shape="rounded"
            />
        </MainContainer>
    </div>
  );
}

export default App;
