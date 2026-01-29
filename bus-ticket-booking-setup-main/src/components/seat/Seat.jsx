import React from "react";
import { MdOutlineChair } from "react-icons/md";
import { GiSteeringWheel } from "react-icons/gi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

const Seat = ({ seatNumber, isSelected, isBooked, onClick }) => {
    return (
        <MdOutlineChair
            className={`text-3xl -rotate-90 cursor-pointer transition-colors duration-200 
            ${isBooked ? 'text-red-500 cursor-not-allowed' :
                    isSelected ? 'text-violet-600' : 'text-neutral-600 hover:text-violet-400'}`}
            onClick={!isBooked ? onClick : undefined}
            title={`Seat ${seatNumber}${isBooked ? ' (Booked)' : ''}`}
        />
    );
};

const BusSeatLayout = ({ price, bookedSeats = [], selectedSeats, setSelectedSeats, totalSeats = 40 }) => {
    const handleSeatClick = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
        } else {
            if (selectedSeats.length < 10) {
                setSelectedSeats([...selectedSeats, seatNumber]);
            } else {
                alert("You can select maximum 10 seats");
            }
        }
    }

    const renderSeats = () => {
        let seats = [];
        for (let i = 1; i <= totalSeats; i++) {
            seats.push(
                <Seat
                    key={i}
                    seatNumber={i}
                    isSelected={selectedSeats.includes(i)}
                    isBooked={bookedSeats.includes(i)}
                    onClick={() => handleSeatClick(i)}
                />
            );
        }
        return seats;
    };

    return (
        <div className="space-y-5">
            <h2 className="text-xl text-neutral-800 dark:text-neutral-100 font-medium">
                Choose Your Seat
            </h2>

            {/* Seat Map Legend */}
            <div className="w-full flex justify-between">
                <div className="flex-1 w-full flex">
                    <div className="w-full flex-1 flex gap-x-5 items-stretch">
                        <div className="w-10 h-full border-r-2 border-dashed border-neutral-300 dark:border-neutral-800">
                            <GiSteeringWheel className='text-3xl mt-6 text-neutral-500 -rotate-90' />
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="flex-1 space-y-4">
                                <div className="w-full grid grid-cols-10 gap-x-3 gap-y-5">
                                    {renderSeats()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3 w-28 ml-4">
                    <div className="flex items-center gap-x-2">
                        <MdOutlineChair className='text-lg text-neutral-600 -rotate-90' />
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm font-normal">
                            Available
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <MdOutlineChair className='text-lg text-red-500 -rotate-90' />
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm font-normal">
                            Booked
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <MdOutlineChair className='text-lg text-violet-600 -rotate-90' />
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm font-normal">
                            Selected
                        </p>
                    </div>
                    <div className="flex items-center gap-x-2 mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <RiMoneyDollarCircleLine className='text-lg text-neutral-600 dark:text-neutral-400' />
                        <p className="text-neutral-800 dark:text-neutral-200 text-sm font-semibold">
                            ₹{price}
                        </p>
                    </div>
                </div>
            </div>

            {/* Selection Summary */}
            {selectedSeats.length > 0 && (
                <div className="!mt-10 bg-neutral-100 dark:bg-neutral-900/50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                        Selected Seats ({selectedSeats.length})
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedSeats.map(seat => (
                            <div key={seat} className="w-8 h-8 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 flex items-center justify-center font-medium text-sm">
                                {seat}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 pt-3">
                        <span className="text-neutral-600 dark:text-neutral-400">Total Price</span>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-violet-600">₹{selectedSeats.length * price}</span>
                            <p className="text-xs text-neutral-500">(Includes taxes)</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusSeatLayout;
