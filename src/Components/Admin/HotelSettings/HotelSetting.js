import React, { useContext, useState } from 'react'
import SideNav from '../SideNav/SideNav'
import './HotelSetting.css'
import MyContext from '../../Context'

const HotelSetting = () => {
    var { actions } = useContext(MyContext);
    var [currentTab, setCurrentTab] = useState(0);
    var [file, setFile] = useState();
    var [file1, setFile1] = useState();

    var handleRecomondedInput = async () => {
        await actions.uploadRecommondedHotelCityList(file);

    }
    var handleInput = async () => {
        //var data = await actions.convertCsvToJson(file)
        await actions.uploadHotelCityList(file1)
    }

    return (
        <div className='hotelsetting-block'>
            <SideNav />
            <div className='hotelsetting-main-block'>
                <div className='hotelsetting-main-tabs'>
                    <div
                        className={currentTab === 0 ? 'hotelsetting-main-tabs-list hotelsetting-main-tabs-list-active' : 'hotelsetting-main-tabs-list'}
                        onClick={() => setCurrentTab(0)}>
                        Recommonded Hotel</div>
                    <div
                        className={currentTab === 1 ? 'hotelsetting-main-tabs-list hotelsetting-main-tabs-list-active' : 'hotelsetting-main-tabs-list'}
                        onClick={() => setCurrentTab(1)}>
                        CSV to JSON</div>
                </div>
                {
                    currentTab === 0 ? (
                        <div className='hotelsetting-main-content'>
                            <div className='hotelsetting-main-box'>
                                <div className='hotelsetting-main-header'>
                                    Upload the Recommended Hotel CSV File
                                </div>
                                <div className='hotelsetting-main-input'>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <button onClick={handleRecomondedInput}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (null)
                }
                {
                    currentTab === 1 ? (
                        <div className='hotelsetting-main-content'>
                            <div className='hotelsetting-main-box'>
                                <div className='hotelsetting-main-header'>
                                    Upload the CSV File
                                </div>
                                <div className='hotelsetting-main-input'>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={(e) => setFile1(e.target.files[0])}
                                    />
                                    <button onClick={handleInput}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (null)
                }
            </div>
        </div>
    )
}

export default HotelSetting
