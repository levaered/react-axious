import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from '../../assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Select, SelectItem } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

function App() {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [firstvalue, setFirstValue] = useState("UAH");
  const [secondvalue, setSecondtValue] = useState("USD");
  const [saleRate, setSaleRate] = useState("0.00");
  const [inputValue, setInputValue] = useState("0");
  const [result, setResult] = useState("0.00");

  const handleFirstSelectionChange = (e) => {
    if (e.target.value === secondvalue) {
      setSecondtValue(firstvalue);
      setFirstValue(e.target.value);
    }
    else {
      setFirstValue(e.target.value);
    }
  };

  const handleSecondSelectionChange = (e) => {
    if (e.target.value === firstvalue) {
      setFirstValue(secondvalue);
      setSecondtValue(e.target.value);
    }
    else {
      setSecondtValue(e.target.value);
    }
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const apiUrl = 'https://api.privatbank.ua/p24api/exchange_rates?json';
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;

      try {
        const response = await axios.get(`${apiUrl}&date=${formattedDate}`);
        setExchangeRates(response.data.exchangeRate);
      } catch (error) {
        console.error('Error fetching data from PrivatBank API:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (!exchangeRates) return;

    const firstrate = exchangeRates.find((e) => e.currency === firstvalue);
    const secondrate = exchangeRates.find((e) => e.currency === secondvalue);
    if (firstvalue !== "UAH" && secondvalue !== "UAH") {
      if (firstrate && secondrate) {
        setSaleRate((firstrate.saleRateNB / secondrate.saleRateNB).toFixed(2) || "0.00");
      }
    }
    else {
      if (firstvalue === "UAH") {
        setSaleRate(secondrate.saleRateNB.toFixed(2) || "0.00");
      }
      else {
        setSaleRate(firstrate.saleRateNB.toFixed(2) || "0.00");
      }
    }
  }, [exchangeRates, firstvalue, secondvalue]);

  useEffect(() => {
    console.log("Инпут:" + inputValue);
    console.log("Продажа:" + saleRate);
    if (firstvalue === "UAH") {
      setResult((parseFloat(inputValue) / parseFloat(saleRate)).toFixed(2));
    }
    else {
      setResult((parseFloat(inputValue) * parseFloat(saleRate)).toFixed(2));
    }
    if(inputValue === ""){
      setResult("0.00")
    }
  }, [inputValue])

  return (
    <div className="app gap-4 px-4 lg:px-8 xl:px-12">
      <Table
        isHeaderSticky
        classNames={{
          base: "max-h-[200px] overflow-x-auto",
          table: "min-h-[420px]",
        }}
        aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>CURRENCY</TableColumn>
          <TableColumn>BUY</TableColumn>
          <TableColumn>SELL</TableColumn>
        </TableHeader>
        <TableBody>
          {exchangeRates && exchangeRates.map((e, index) => (
            <TableRow key={index}>
              <TableCell>{e.currency}</TableCell>
              <TableCell>{e.purchaseRateNB}</TableCell>
              <TableCell>{e.saleRateNB}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="currency-coverter gap-4">
        <h4 className="headline font-bold text-lg lg:text-xl xl:text-2xl">Currency Converter</h4>
        <div className="currencies flex flex-col lg:flex-row gap-3">
          <Select
            label="From"
            className="flex-1"
            selectedKeys={[firstvalue]}
            onChange={handleFirstSelectionChange}
          >
            <SelectItem key="UAH">UAH</SelectItem>
            <SelectItem key="USD">USD</SelectItem>
            <SelectItem key="EUR">EUR</SelectItem>
          </Select>
          <Select
            label="To"
            placeholder="Select a currency"
            className="flex-1"
            selectedKeys={[secondvalue]}
            onChange={handleSecondSelectionChange}
          >
            <SelectItem key="UAH">UAH</SelectItem>
            <SelectItem key="USD">USD</SelectItem>
            <SelectItem key="EUR">EUR</SelectItem>
          </Select>
          <div className="flex-1 exchange-rate bg-gray-100 p-2 rounded">
            {saleRate}
          </div>
        </div>
        <div className="currenies-inputs flex flex-col lg:flex-row gap-3">
          <Input className='flex-1' type="number" label="Amount" value={inputValue} onValueChange={setInputValue} />
          <div className="flex-1 exchange-rate bg-gray-100 p-2 rounded">
            {result}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
