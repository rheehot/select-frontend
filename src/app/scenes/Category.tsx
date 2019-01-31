import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

import { PCPageHeader } from 'app/components';
import { ConnectedGridBookList } from 'app/components/GridBookList';
import history from 'app/config/history';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Category as CategoryState, CategoryCollectionState } from 'app/services/category';
import { Actions as categoryActions } from 'app/services/category';
import { getIdFromLocationSearch, isValidNumber } from 'app/services/category/utils';
import { RidiSelectState } from 'app/store';

interface CategoryStateProps {
  isCategoryListFetched: boolean;
  categoryList: CategoryState[];
  categoryId: number;
  category: CategoryCollectionState;
  books: BookState;
}

type Props = CategoryStateProps & ReturnType<typeof mapDispatchToProps>;

interface State {
  isInitialized: boolean;
}

export class Category extends React.Component<Props, State> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  private renderSelectBox() {
    const { categoryId, categoryList = [] } = this.props;
    return (
      <div className="RUISelectBox RUISelectBox-outline Category_SelectBox">
        <select
          title="카테고리 선택"
          className="RUISelectBox_Select"
          value={categoryId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            history.push(`/categories?id=${e.currentTarget.value}`);
          }}
        >
          {categoryList.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}}
        </select>
        <svg viewBox="0 0 48 28" className="RUISelectBox_OpenIcon">
          <path d="M48 .6H0l24 26.8z"/>
        </svg>
      </div>
    );
  }

  public componentDidMount() {
    const { categoryId } = this.props;
    this.initialDispatchTimeout = window.setTimeout(() => {
      if (isValidNumber(categoryId)) {
        this.props.dispatchCacheCategoryId(categoryId);
      }
      this.props.dispatchInitializeCategoriesWhole(
        !this.props.isCategoryListFetched,
        !isValidNumber(categoryId),
      );
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public componentDidUpdate(prevProps: Props) {
    const { categoryId } = this.props;
    if (this.state.isInitialized && isValidNumber(categoryId) && prevProps.categoryId !== categoryId) {
      this.props.dispatchCacheCategoryId(categoryId);
    }
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public render() {
    const {
      books,
      category,
      categoryId,
      dispatchLoadCategoryBooks,
      isCategoryListFetched,
    } = this.props;
    return (
      <main className="SceneWrapper">
        <Helmet title="카테고리 - 리디셀렉트" />
        <PCPageHeader pageTitle="카테고리">
          {isValidNumber(categoryId) && this.renderSelectBox()}
        </PCPageHeader>
        <MediaQuery maxWidth={840}>
          {(isMobile) => isMobile
            && (
            <div className="Category_Header GridBookList">
              {isValidNumber(categoryId) && this.renderSelectBox()}
            </div>
          )}
        </MediaQuery>
        {(
          !this.state.isInitialized ||
          !isCategoryListFetched ||
          !isValidNumber(categoryId)
        ) ? (
          <GridBookListSkeleton />
        ) : (
          <ConnectedListWithPagination
            isFetched={(page) => category && category.itemListByPage[page] && category.itemListByPage[page].isFetched}
            fetch={(page) => dispatchLoadCategoryBooks(categoryId, page)}
            itemCount={category ? category.itemCount : undefined}
            buildPaginationURL={(p: number) => `/categories?id=${categoryId}&page=${p}`}
            renderPlaceholder={() => (<GridBookListSkeleton />)}
            _key={categoryId.toString()}
            renderItems={(page) => (
              <ConnectedGridBookList
                pageTitleForTracking="category"
                filterForTracking={categoryId.toString()}
                books={category.itemListByPage[page].itemList.map((id) => books[id].book!)}
              />
            )}
          />
        )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): CategoryStateProps => {
  return {
    isCategoryListFetched: rootState.categories.isFetched,
    categoryList: rootState.categories.itemList,
    categoryId: Number(getIdFromLocationSearch(rootState.router.location!.search)),
    category: rootState.categoriesById[Number(getIdFromLocationSearch(rootState.router.location!.search))],
    books: rootState.booksById,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  dispatchInitializeCategoriesWhole: (shouldFetchCategoryList: boolean, shouldInitializeCategoryId: boolean) =>
    dispatch(categoryActions.initializeCategoriesWhole({ shouldFetchCategoryList, shouldInitializeCategoryId })),
  dispatchLoadCategoryList: () =>
    dispatch(categoryActions.loadCategoryListRequest()),
  dispatchInitializeCategoryId: () =>
    dispatch(categoryActions.initializeCategoryId()),
  dispatchCacheCategoryId: (categoryId: number) =>
    dispatch(categoryActions.cacheCategoryId({ categoryId })),
  dispatchLoadCategoryBooks: (categoryId: number, page: number) =>
    dispatch(categoryActions.loadCategoryBooksRequest({ categoryId, page })),
});

export const ConnectedCategory = connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(Category);
