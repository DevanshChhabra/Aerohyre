#include <iostream>
#include <cassert>

using namespace std;

class SparseMatrix {
private:
    struct Node {
        int row, col;
        double value;
        Node* next;

        Node(int r, int c, double v) : row(r), col(c), value(v), next(nullptr) {}
    };

    static const int TABLE_SIZE = 1009;  
    Node* table[TABLE_SIZE];
    size_t count;

    int hash(int row, int col) const {
        return (row * 31 + col) % TABLE_SIZE;
    }

public:
    SparseMatrix() : count(0) {
        for (int i = 0; i < TABLE_SIZE; i++)
            table[i] = nullptr;
    }

    ~SparseMatrix() {
        for (int i = 0; i < TABLE_SIZE; i++) {
            Node* current = table[i];
            while (current) {
                Node* todelete = current;
                current = current->next;
                delete todelete;
            }
        }
    }

    void set(int row, int col, double value) {
        int index = hash(row, col);
        Node* current = table[index];

        while (current) {
            if (current->row == row && current->col == col) {
                if (value == 0) {
                    Node** ptr = &table[index];
                    while (*ptr && ((*ptr)->row != row || (*ptr)->col != col))
                        ptr = &(*ptr)->next;

                    if (*ptr) {
                        Node* toDelete = *ptr;
                        *ptr = (*ptr)->next;
                        delete toDelete;
                        count--;
                    }
                } 
                else {
                    current->value = value;
                }
                return;
            }
            current = current->next;
        }

        if (value != 0) {
            Node* newNode = new Node(row, col, value);
            newNode->next = table[index];
            table[index] = newNode;
            count++;
        }
    }

    double get(int row, int col) const {
        int index = hash(row, col);
        Node* current = table[index];
        while (current) {
            if (current->row == row && current->col == col)
                return current->value;
            current = current->next;
        }
        return 0.0;
    }

    size_t nonZeroCount() const{
        return count;
    }

    SparseMatrix transpose() const {
        SparseMatrix result;
        for (int i=0; i<TABLE_SIZE; i++) {
            Node* current=table[i];
            while (current) {
                result.set(current->col,current->row,current->value);
                current=current->next;
            }
        }
        return result;
    }

    class Iterator {
    private:
        const SparseMatrix& matrix;
        int index;
        Node* current;

    public:
        Iterator(const SparseMatrix& mat, bool begin) : matrix(mat), index(0), current(nullptr) {
            if (begin) advanceToNext();
        }

        void advanceToNext() {
            while (index < TABLE_SIZE && current==nullptr) {
                current = matrix.table[index++];
            }
        }

        bool operator!=(const Iterator& other) const {
            return current != other.current;
        }

        const Node& operator*() const {
            return *current;
        }

        Iterator& operator++() {
            if (current) current = current->next;
            if (!current) advanceToNext();
            return *this;
        }
    };

    Iterator begin() const { 
        return Iterator(*this, true);
    }
    Iterator end() const { 
        return Iterator(*this, false); 
    }
};

int main() {
    SparseMatrix sm;
    sm.set(1, 2, 3.5);
    sm.set(3, 4, 1.2);
    sm.set(1, 2, 4.0);
    sm.set(0, 0, 0); // ignored
    sm.set(3, 4, 0); // removed

    cout << "Value at (1, 2): " << sm.get(1, 2) << "\n";
    cout << "Value at (3, 4): " << sm.get(3, 4) << "\n";
    cout << "Non-zero count: " << sm.nonZeroCount() << "\n";

    SparseMatrix trans = sm.transpose();
    cout << "Transpose value at (2, 1): " << trans.get(2, 1) << "\n";

    cout << "Iterating non-zero entries:\n";
    for (auto it = sm.begin(); it != sm.end(); ++it) {
        const auto& node = *it;
        cout << "(" << node.row << ", " << node.col << ") = " << node.value << "\n";
    }

    return 0;
}
