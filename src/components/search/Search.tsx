import { GetProps, Input } from 'antd';

const { Search } = Input;
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

type SearchProps = GetProps<typeof Input.Search>;

export default function SearchComponent() {
    return (
        <Search
            placeholder="Pesquise por produtos próximos a você"
            allowClear
            onSearch={onSearch}
            style={{ width: '100%', padding: '0px 10px' }}
        />
    )
}
