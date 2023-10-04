
export default function Filter({filterValue, handleFilterFunction}) {

    return (
        <>
        Filter shown with: <input value={filterValue} onChange={handleFilterFunction} />
        </>
    )
    
}