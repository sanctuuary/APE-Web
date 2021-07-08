/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Button, Input, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ColumnFilterItem } from 'antd/lib/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import Domain, { Access, DomainInfo } from '@models/Domain';
import styles from './DomainList.module.less';

/**
 * Props for DomainList component.
 */
interface IProps {
  /** The domains to display */
  domains: DomainInfo[],
  /** Boolean to show edit button */
  edit: boolean,
  /** Boolean to show if visibility column should be shown or not */
  showVisibility?: boolean,
  /** Boolean to show access level */
  showAccess?: boolean,
  /** Whether to show a column with the owners. */
  showOwner?: boolean,
}

/**
 * State of DomainList component.
 */
interface IState {
  /** The currently selected filters for the topic tags */
  topicFilters: string[],
}

/**
 * A component showing a table of given domains.
 *
 * Used for public domains, owned domains, and shared domains.
 * The different variations are set via the `edit`, `showVisibility`, and `showAccess` props.
 */
class DomainList extends React.Component<IProps, IState> {
  /** React RefObject to refer to the domain name search input */
  titleSearchRef: React.RefObject<Input>;

  /**
   * Constructor
   * @param props The props for the DomainList component
   */
  constructor(props: Readonly<IProps>) {
    super(props);
    this.titleSearchRef = React.createRef();

    const { domains } = this.props;
    this.state = {
      topicFilters: [],
    };
    // Set the topic filters
    this.setTopicsFilters(domains);
  }

  /**
   * Generate the properties to allow search on domain name
   */
  getTitleSearchProps = () => ({
    // Define the title search filter dropdown
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={this.titleSearchRef}
          placeholder="Search by name"
          value={selectedKeys[0]}
          // Keep the value of this input up-to-date
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            data-testid="searchNameButton"
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
            data-testid="searchNameReset"
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    // Highlight the filter icon when a search filter is applied
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        className={filtered ? styles.nameSearchIcon : null}
      />
    ),
    // Filter rule
    onFilter: (val, record) => record.title.toString().toLowerCase().includes(val.toLowerCase()),
    // Select the search input after the search dropdown has opened
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => this.titleSearchRef.current.select(), 100);
      }
    },
  });

  /**
   * Sort strings a and b alphabetically
   * @param a entry 1 to compare
   * @param b entry 2 to compare
   */
  alphabeticSort = (a: string, b: string) => {
    // Sort alphabetically
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    if (aLower < bLower) {
      return -1;
    }
    if (aLower > bLower) {
      return 1;
    }
    return 0;
  };

  /**
   * Definition of the columns, required by Ant Design.
   */
  /*
   * Normally variables should be placed above the component's constructor
   * However, this is impossible as getTitleSearchProps would be defined below
   * and we would get an "Property is used before its initialization" error.
   */
  // eslint-disable-next-line react/sort-comp
  columns: ColumnsType<DomainInfo> = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
      // Set fixed width, else filters will make width vary
      width: 500,
      render: (_, domain) => {
        const { edit } = this.props;
        const access = domain.access === Access.Owner || domain.access === Access.ReadWrite;
        return (
          <div>
            {domain.title}
            <Space className={styles.buttonAction}>
              <Button type="primary" href={`/explore/${domain.id}`}>Explore</Button>
              {edit && <Button href={`/domain/edit/${domain.id}`} disabled={!access}>Edit</Button>}
            </Space>
          </div>
        );
      },
      sorter: (a, b) => this.alphabeticSort(a.title, b.title),
      defaultSortOrder: 'ascend',
      ...this.getTitleSearchProps(),
    },
    {
      title: 'Topics',
      key: 'topics',
      render: (domain: DomainInfo) => (
        <>
          {/* Add tag to official domains */}
          {domain.official && (
            <Tag color="gold" key="Official">OFFICIAL</Tag>
          )}
          {/* Add each topic tag */}
          {domain.topics.map((tag: string) => (
            <Tag color="green" key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      ),
      /*
       * Filter will show rows which have ANY of the selected tags (OR-based filter)
       * This should most likely become an AND-based filter in the future
       */
      onFilter: (_value: string, record) => {
        const { topicFilters: filters } = this.state;

        /*
         * No filters are selected, all rows should be shown.
         * This is an edge case where selecting -> deselecting -> selecting filters
         * makes the topicFilters null.
         */
        if (filters === null) {
          return true;
        }

        // Start by assuming no tags are present
        const contains: boolean[] = [].fill(false, 0, filters.length);
        // Check each selected tag
        filters.forEach((filter, index) => {
          // Check if the tag we are currently checking is present in the domain
          let containsCurrent = false;
          record.topics.forEach((tag) => {
            if (tag === filter) {
              containsCurrent = true;
            }
          });
          // Store whether we found the current tag
          contains[index] = containsCurrent;
        });
        // Check if all tags were found
        const containsAll = contains.every((x) => x === true);
        return containsAll;
      },
    },
  ];

  /**
   * Serialize domains so they are usable by Ant Design's Table component.
   * @param domains The domains to serialize
   * @returns The domains in Ant Design's Table dataSource format
   */
  serializeDomains = (domains: DomainInfo[]) => {
    const result = [];
    domains.forEach((domain, index) => {
      result.push({
        // Add key
        key: index.toString(),
        // Add the domain data
        ...domain,
      });
    });
    return result;
  };

  /**
   * Create a list of filter options for Ant Design to use.
   * @param domains The domains who's topics should be added to the filter options
   * @returns The topics in Ant Design's column filter format
   */
  setTopicsFilters = (domains: DomainInfo[]) => {
    const filters: Set<ColumnFilterItem> = new Set();
    domains.forEach((domain: DomainInfo) => {
      filters.add({ text: 'Official', value: 'Official' });

      domain.topics.forEach((tag: string) => {
        filters.add({ text: tag, value: tag });
      });
    });
    this.columns[1].filters = Array.from(filters);
  };

  /**
   * Handle changes to the table.
   *
   * In this case used to change the behaviour of the topic filter
   * to make each row filter on having all selected tags instead of any.
   * @param _pagination The pagination configuration of the table
   * @param filters Filter data of each column
   */
  onTableChange = (_pagination, filters) => {
    this.setState({ topicFilters: filters.topics });
  };

  /**
   * Function that checks if the optional columns should be added and do not exist yet
   * and then adds them accordingly
   */
  showOptionalColumns = () => {
    const { showVisibility, showAccess, showOwner } = this.props;

    if (showVisibility && !this.columns.some((elem) => elem.title === 'Visibility')) {
      this.columns.push({
        title: 'Visibility',
        dataIndex: 'visibility',
        key: 'visibility',
        render: (visibility) => visibility,
        sorter: (a, b) => this.alphabeticSort(a.visibility, b.visibility),
        defaultSortOrder: 'ascend',
      });
    }
    if (showAccess && !this.columns.some((elem) => elem.title === 'Access Level')) {
      this.columns.push({
        title: 'Access Level',
        dataIndex: 'access',
        key: 'access',
        render: (access) => access,
        sorter: (a, b) => this.alphabeticSort(a.access, b.access),
        defaultSortOrder: 'ascend',
      });
    }
    if (showOwner && !this.columns.some((elem) => elem.title === 'Owner')) {
      this.columns.push({
        title: 'Owner',
        dataIndex: 'ownerName',
        width: 300,
        render: (ownerName) => ownerName,
      });
    }
  };

  render() {
    // Serialize the domains to fill the table
    const { domains } = this.props;
    const tableData = this.serializeDomains(domains);
    this.showOptionalColumns();
    return (
      <div className={styles.domainList}>
        <Table
          columns={this.columns}
          dataSource={tableData}
          onChange={this.onTableChange}
          expandable={{
            expandedRowRender: (domain: Domain) => (
              <p
                style={{ whiteSpace: 'pre-line' }}
                data-testid={`description-${domain.id}`}
              >
                {domain.description}
              </p>
            ),
            rowExpandable: (domain: Domain) => domain.description !== undefined,
          }}
        />
      </div>
    );
  }
}

export default DomainList;
