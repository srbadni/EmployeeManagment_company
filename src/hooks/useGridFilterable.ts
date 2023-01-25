import React, {useCallback} from "react";
import {CompositeFilterDescriptor, filterBy} from "@progress/kendo-data-query";
import {GridFilterChangeEvent} from "@progress/kendo-react-grid";

interface useGridFilterableProps {
    initialFilter: CompositeFilterDescriptor;
    data: any[]
}

interface ExportUseGridFilterable {
    gridControlProps: () => any
}

const useGridFilterable = (props: useGridFilterableProps): ExportUseGridFilterable => {
    const [filter, setFilter] = React.useState(props.initialFilter);
    const gridControlProps = useCallback(() => {
        return {
            data: filterBy(props.data, filter),
            filterable: true,
            onFilterChange: (e: GridFilterChangeEvent) => setFilter(e.filter),
            filter,
        }
    }, [props.data, filter])

    return {
        gridControlProps
    }
}

export default useGridFilterable;
