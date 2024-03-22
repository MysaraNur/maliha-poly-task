"use client";
import { useState, useEffect } from "react";
import { database } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const [selectedAll, setSelectedAll] = useState(false);
  const [textboxNumber, setTextboxNumber] = useState("");
  const [textboxes, setTextboxes] = useState([]);

  const handleTextBoxesChange = (index, value) => {
    setTextboxes((currenttextboxes) =>
      currenttextboxes.map((input, i) =>
        i === index ? { ...input, text: value } : input
      )
    );
  };

  const handleNumberOfTextboxChange = (e) => {
    setTextboxNumber(e.target.value);
  };

  const handleChecks = (index) => {
    setTextboxes((currenttextboxes) =>
      currenttextboxes.map((input, i) =>
        i === index ? { ...input, checked: !input.checked } : input
      )
    );
  };

  const addTextboxes = () => {
    const num = parseInt(textboxNumber, 10) || 0;
    setTextboxes(
      Array.from({ length: num }, () => ({ text: "", checked: selectedAll }))
    );
  };

  const handleIsSelectedAll = () => {
    setSelectedAll(!selectedAll);
    setTextboxes((currenttextboxes) =>
      currenttextboxes.map((input) => ({ ...input, checked: !selectedAll }))
    );
  };

  useEffect(() => {
    const allChecked = textboxes.every((input) => input.checked);
    setSelectedAll(allChecked);
  }, [textboxes]);

  const totalSum = () => {
    return textboxes.reduce((acc, curr) => {
      if (curr.checked) {
        const value = parseFloat(curr.text) || 0;
        return acc + value;
      }
      return acc;
    }, 0);
  };

  useEffect(() => {
    const sum = totalSum();
    const updateSum = async () => {
      try {
        await addDoc(collection(database, "sum"), {
          sum: sum,
        });
      } catch (error) {
        console.error(error);
      }
    };
      updateSum();
  }, [textboxes]);

  return (
    <div className="flex w-full h-screen items-center justify-center flex-col">
      <div className="flex gap-2">
        <input
          type="number"
          value={textboxNumber}
          onChange={handleNumberOfTextboxChange}
          className=" rounded-lg bg-white border border-black px-4"
          placeholder="No of Textboxes"
        />
        <button
          onClick={addTextboxes}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Textboxes
        </button>
      </div>
      {textboxes.length > 0 && (
        <div className="mt-4">
          <label>
            <input
              type="checkbox"
              checked={selectedAll}
              onChange={handleIsSelectedAll}
              className="mr-2"
            />
            Check All
          </label>
        </div>
      )}
      {textboxes.map((input, index) => (
        <div key={index} className="mt-2">
          <label>
            <input
              type="checkbox"
              checked={input.checked}
              onChange={() => handleChecks(index)}
              className="mr-2"
            />
            <input
              type="number"
              value={input.text}
              onChange={(e) => handleTextBoxesChange(index, e.target.value)}
              className="border rounded-lg p-3"
              placeholder={`Textbox ${index + 1}`}
            />
          </label>
        </div>
      ))}
      <div className="mt-4">
        Selected{" "}
        <span className="font-bold">
          {textboxes.filter((input) => input.checked).length}items
        </span>
        , there <span className="ml-1 mr-1 font-bold">position is</span>
        {textboxes.filter((input) => input.checked).length > 0 && (
          <>
            <span className="ml-1 mr-1 font-bold">
              {textboxes
                .map((input, index) => (input.checked ? index + 1 : null))
                .filter((index) => index !== null)
                .join(", ")}
            </span>
            and Total number is
            <span className="ml-1 mr-1 font-bold"> {totalSum()}</span>
          </>
        )}
      </div>
    </div>
  );
}
