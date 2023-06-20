import React, { useState, useEffect } from 'react';

const CountryList = () => {
    const [countries, setCountries] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterSize, setFilterSize] = useState('');
    const [filterRegion, setFilterRegion] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        fetchCountryData();
    }, []);

    const fetchCountryData = async () => {
        try {
            const response = await fetch('https://restcountries.com/v2/all?fields=name,region,area');
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error('Error fetching country data:', error);
        }
    };

    const handleSort = () => {
        const sortedCountries = [...countries];
        sortedCountries.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        setCountries(sortedCountries);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleSizeFilterChange = (event) => {
        setFilterSize(event.target.value);
    };

    const handleRegionFilterChange = (event) => {
        setFilterRegion(event.target.value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const filteredCountries = countries.filter((country) => {
        if (filterSize && country.area && country.name === 'Lithuania') {
            return country.area < filterSize;
        }
        if (filterRegion && country.region) {
            return country.region.toLowerCase() === filterRegion.toLowerCase();
        }
        return true;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCountries.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div className="container">
            {/* <h1>Country List</h1> */}
            <div className="row mb-3">
                <div className="col">
                    <label>
                        Filter by size (smaller than Lithuania):
                        <input type="number" min="0" className="form-control" value={filterSize} onChange={handleSizeFilterChange} />
                    </label>
                </div>
                <div className="col">
                    <label>
                        Filter by region:
                        <input type="text" className="form-control" value={filterRegion} onChange={handleRegionFilterChange} />
                    </label>
                </div>
            </div>
            <button className="btn btn-primary mb-3" onClick={handleSort}>Sort by Name ({sortOrder})</button>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Country Name</th>
                        <th scope="col">Region</th>
                        <th scope="col">Area Size</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((country) => (
                        <tr key={country.name}>
                            <td>{country.name}</td>
                            <td>{country.region}</td>
                            <td>{country.area} sq km</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav>
                <ul className="pagination">
                    {pageNumbers.map((pageNumber) => (
                        <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                                {pageNumber}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default CountryList;
